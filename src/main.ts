/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as core from '@actions/core'
import * as github from '@actions/github'
import {wait} from './wait'
import {env} from 'process'
import {setFailed, info} from '@actions/core'
import path from 'path'
import glob from 'glob'
export interface Logger {
  setFailed: (msg: any) => void
  info: (msg: any) => void
}

async function run(logger: Logger): Promise<void> {
  try {
    logger.info(`Github Workspace path is: ${env.GITHUB_WORKSPACE!}`)
    logger.info(`Production Stage is: ${env.PRODUCTION_STAGE!}`)
    const cloudFormationTemplatesPath: string = path.join(
      env.GITHUB_WORKSPACE!,
      '/cdk.out/'
    )
    const patternToMatch: string = core.getInput('templateMatchPattern')

    const pattern = `@(${env.PRODUCTION_STAGE!}*InfraStack.template.json)`
    logger.info(`Match Pattern is: ${pattern}`)
    let filesToReturn: string[] = []
    new glob.Glob(
      cloudFormationTemplatesPath + pattern,
      {},
      (err: any, files: any) => {
        logger.info(files)
        filesToReturn = files
      }
    )
    core.setOutput('matrix', filesToReturn)

    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    logger.setFailed(error.message)
  }
}

run({setFailed, info})
