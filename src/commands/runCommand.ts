import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import * as process from 'child_process'
import * as vscode from 'vscode'

export function runCommand () {
  const document = vscode.window.activeTextEditor?.document
  if (!document || document.languageId !== 'pico8') {
    vscode.window.showErrorMessage('Failed running PICO-8: unable to locate current document')
    return
  } else if (document.languageId !== 'pico8') {
    vscode.window.showErrorMessage('Failed running PICO-8: current file is unsupported by PICO-8')
    return
  }
  const extensionConfiguration = vscode.workspace.getConfiguration('pico8tools')
  var pico8Path = extensionConfiguration.pico8Path
  if (pico8Path === 'default') {
    switch (os.platform()) {
      case 'darwin':
        pico8Path = '/Applications/PICO-8.app/Contents/MacOS/pico8'
        break
      case 'win32':
        pico8Path = 'C:\\"Program Files (x86)"\\PICO-8\\pico8.exe'
        break
      default:
        vscode.window.showErrorMessage('Cannot determine PICO-8 executable path for your platform. Please specify the correct path.')
        return
    }
  }
  const fileName = document!.fileName
  fs.access(fileName, fs.constants.F_OK, (error) => {
    if (error) {
      vscode.window.showErrorMessage(`PICO-8 file (${fileName}) cannot be accessed: ${error.name} - ${error.message}`)
      return
    }
        document!.save().then(() => {
          process.exec(`${path.normalize(pico8Path)} -run "${fileName}" ${extensionConfiguration.additionalArguments}`, (error, stdout, stderr) => {
            if (stdout && stdout.length > 0) {
              console.log(`PICO-8 stdout: ${stdout}`)
            }
            if (stderr && stderr.length > 0) {
              console.log(`PICO-8 stderr: ${stderr}`)
            }
            if (error) {
              vscode.window.showErrorMessage(`PICO-8 error: ${error.name} - ${error.message}`)
            }
          })
        })
  })
}
