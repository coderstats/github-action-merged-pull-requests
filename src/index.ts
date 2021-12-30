import * as core from '@actions/core'
import { promises as fs } from 'fs'
import { GraphQLClient } from 'graphql-request'
import { query } from './query'


run()


async function run(): Promise<void> {
    const token = core.getInput('token')
    const output = core.getInput('output')

    const endpoint = 'https://api.github.com/graphql'
    const client = new GraphQLClient(endpoint, {
        headers: {
            authorization: `Bearer ${token}`
        }
    })

    let repos = new Map()
    const data = await client.request(query)
    data.viewer.pullRequests.nodes.forEach((node: any) => {
        const repo = node.repository.nameWithOwner
        if (repos.has(repo)) {
            repos.get(repo).prCount++
        } else {
            const lang = node.repository.primaryLanguage ? node.repository.primaryLanguage.name : ''
            repos.set(repo, {prCount: 1, starCount: node.repository.stargazers.totalCount, primaryLanguage: lang})
        }
    })

    // Sort descending by prCount, then by starCount and finally ascending by repo owner with name
    let sortedRepos = new Map([...repos.entries()].sort((a, b) => {
        let diff: any = b[1].prCount - a[1].prCount
        if (diff !== 0) return diff

        diff = b[1].starCount - a[1].starCount
        if (diff !== 0) return diff

        return a[0].starCount - b[0].starCount
    }))

    // Create Markdown table
    let markdown = '| Repository | Primary Language | PR Count | Star Count |\n| :-- | :-- | --: | --: |\n'
    for (const [repo, value] of sortedRepos.entries()) {
        markdown += `| [${repo}](https://github.com/${repo}) | ${value.primaryLanguage} | ${value.prCount} | ${value.starCount} |\n`
    }

    await fs.writeFile(output, markdown)
}
