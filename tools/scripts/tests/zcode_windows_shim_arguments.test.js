const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
(async () => {
  const modulePath=path.resolve(__dirname,'../../../skills/zcode-delegate/scripts/relay.mjs');
  const {quoteWindowsShimValue,windowsShimInvocation}=await import(pathToFileURL(modulePath));
  for(const unsafe of ['x" & echo injected','%COMSPEC%','!VALUE!','bad\rpath','bad\npath','bad\0path']) {
    assert.throws(()=>quoteWindowsShimValue(unsafe));
    assert.throws(()=>windowsShimInvocation(unsafe,['--version']));
    assert.throws(()=>windowsShimInvocation('C:\\ZCode\\zcode.cmd',[unsafe]));
  }
  const result=windowsShimInvocation('C:\\Program Files\\ZCode\\zcode.cmd',['--cwd','C:\\Research & Tests','--prompt','Follow the attached brief exactly.']);
  assert.equal(result.command,'cmd.exe');
  assert.deepEqual(result.argv.slice(0,4),['/d','/v:off','/s','/c']);
  assert.ok(result.argv[4].includes('"C:\\Research & Tests"'));
  assert.equal(quoteWindowsShimValue('C:\\'),'"C:\\\\"');
  console.log('ZCode shim inputs reject expansion/control injection and preserve spaces/trailing backslashes; no CLI dispatched.');
})().catch(error=>{console.error(error);process.exitCode=1;});
