import * as core from '@actions/core'
import * as github from '@actions/github';
import {wait} from './wait'
import { env } from 'process';
const path = require('path')
var glob = require("glob")

async function run(): Promise<void> {
  try {
    core.debug(env.GITHUB_WORKSPACE!)
    core.debug(env.PRODUCTION_STAGE!)
    const cloudFormationTemplatesPath:string = path.join(env.GITHUB_WORKSPACE!, '/cdk.out/');
    const patternToMatch: string = core.getInput('templateMatchPattern')

    var pattern = "@(" + env.PRODUCTION_STAGE! + "*InfraStack.template.json)"
    console.log(pattern)


    glob.Glob(cloudFormationTemplatesPath + pattern, {}, (err:any, files:any)=>{
      core.debug(files)
      core.setOutput('clientStacksToDeploy', files)
    })
    // const ms: string = core.getInput('milliseconds')
    // core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    // core.debug(new Date().toTimeString())
    // await wait(parseInt(ms, 10))
    // core.debug(new Date().toTimeString())

    // core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
