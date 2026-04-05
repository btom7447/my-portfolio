import { NextResponse } from 'next/server'

const GITHUB_QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        totalIssueContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
      repositories(first: 100, ownerAffiliations: OWNER, orderBy: { field: PUSHED_AT, direction: DESC }) {
        totalCount
        nodes {
          name
          pushedAt
          primaryLanguage {
            name
            color
          }
        }
      }
    }
  }
`

export async function GET() {
  const token = process.env.GITHUB_TOKEN
  const username = process.env.GITHUB_USERNAME || 'btom7447'

  if (!token) {
    return NextResponse.json(
      { error: 'GitHub token not configured' },
      { status: 503 },
    )
  }

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: GITHUB_QUERY, variables: { login: username } }),
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'GitHub API error' },
        { status: res.status },
      )
    }

    const json = await res.json()
    const user = json.data?.user
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const cc = user.contributionsCollection
    const calendar = cc.contributionCalendar

    // Extract last 90 days of contributions
    const allDays = calendar.weeks
      .flatMap((w: { contributionDays: { contributionCount: number; date: string }[] }) => w.contributionDays)

    const sparkline = allDays.slice(-90).map(
      (d: { contributionCount: number }) => d.contributionCount,
    )

    // Total contributions this year
    const totalContributions = calendar.totalContributions

    // Current streak — count consecutive days with contributions going backwards from today
    let streak = 0
    for (let i = allDays.length - 1; i >= 0; i--) {
      // Skip today if no contributions yet (streak shouldn't break mid-day)
      if (i === allDays.length - 1 && allDays[i].contributionCount === 0) continue
      if (allDays[i].contributionCount > 0) {
        streak++
      } else {
        break
      }
    }

    // Last shipped
    const repos = user.repositories.nodes as { name: string; pushedAt: string; primaryLanguage: { name: string; color: string } | null }[]
    const lastRepo = repos[0]
    let daysAgo = 0
    let repoName = ''
    if (lastRepo) {
      repoName = lastRepo.name
      daysAgo = Math.floor(
        (Date.now() - new Date(lastRepo.pushedAt).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    }

    // Public repo count
    const publicRepos = user.repositories.totalCount

    // Top languages — count occurrences across repos
    const langMap = new Map<string, { count: number; color: string }>()
    for (const repo of repos) {
      if (repo.primaryLanguage) {
        const existing = langMap.get(repo.primaryLanguage.name)
        if (existing) {
          existing.count++
        } else {
          langMap.set(repo.primaryLanguage.name, {
            count: 1,
            color: repo.primaryLanguage.color || '#8b8b8b',
          })
        }
      }
    }
    const topLanguages = [...langMap.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([name, { count, color }]) => ({ name, count, color }))

    return NextResponse.json({
      lastShipped: { repo: repoName, daysAgo },
      sparkline,
      totalContributions,
      streak,
      publicRepos,
      topLanguages,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 },
    )
  }
}
