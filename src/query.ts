export const query = `query mergedPullRequests {
  viewer {
    pullRequests(orderBy: {field: CREATED_AT, direction: ASC}, last: 100, states: MERGED) {
      totalCount
      nodes {
        repository {
          nameWithOwner
          stargazers {
            totalCount
          }
          primaryLanguage {
            name
          }
        }
        mergedAt
      }
    }
    login
  }
}`