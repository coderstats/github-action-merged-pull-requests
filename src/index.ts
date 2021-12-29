import * as dotenv from 'dotenv'
import { promises as fs } from 'fs'
import { GraphQLClient } from 'graphql-request'
import { query } from './query'


dotenv.config()
run()


async function run(): Promise<void> {
    const token = process.env.token
    const output = process.env.output

    const endpoint = 'https://api.github.com/graphql'
    const client = new GraphQLClient(endpoint, {
        headers: {
            authorization: `Bearer ${token}`
        }
    })

    const data = await client.request(query)
    // await fs.writeFile('data/merged-pull-requests.json', JSON.stringify(data))
    // const result = await fs.readFile('./data/merged-pull-requests.json', { encoding: 'utf8' })
    // const data = JSON.parse(result)

    let repos = new Map()
    data.viewer.pullRequests.nodes.forEach((node: any) => {
        const repo = node.repository.nameWithOwner
        if (repos.has(repo)) {
            repos.get(repo).prCount++
        } else {
            const lang = node.repository.primaryLanguage ? node.repository.primaryLanguage.name : ''
            repos.set(repo, {prCount: 1, starCount: node.repository.stargazers.totalCount, primaryLanguage: lang})
        }
    })

    // Sort by prCount and then by starCount
    let sortedRepos = new Map([...repos.entries()].sort((a, b) => {
        const diff = b[1].prCount - a[1].prCount
        if (diff !== 0) {
            return diff
        }
        return b[1].starCount - a[1].starCount;
    }))

    // Create Markdown table
    let markdown = '| Repository | Primary Language | PR Count | Star Count |\n| :-- | :-- | --: | --: |\n'
    for (const [repo, value] of sortedRepos.entries()) {
        markdown += `| [${repo}](https://github.com/${repo}) | ${value.primaryLanguage} | ${value.prCount} | ${value.starCount} |\n`
    }

    await fs.writeFile(output, markdown)
}
