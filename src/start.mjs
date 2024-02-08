#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

// Import commands
import * as info from './commands/info.mjs'

// Process CLI
yargs(hideBin(process.argv))
    .scriptName('metapress')
    .command([info])
    .demandCommand()
    .help()
    .parse()