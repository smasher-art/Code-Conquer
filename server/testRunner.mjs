import { runCode, normalizeLang } from './runner.js'

async function test() {
  const cases = [
    { lang: 'python', code: 'print("hello")' },
    { lang: 'c', code: '#include <stdio.h>\nint main(){ printf("hi\\n"); return 0; }' },
    { lang: 'cpp', code: '#include <iostream>\nint main(){ std::cout<<"hello cpp"<<std::endl; return 0; }' },
    { lang: 'java', code: 'public class Main{ public static void main(String[]a){ System.out.println("hello java"); }}' },
    { lang: 'go', code: 'package main\nimport "fmt"\nfunc main(){ fmt.Println("hello go") }' },
  ]

  for (const c of cases) {
    console.log('\n---', c.lang, '---')
    try {
      const res = await runCode(c.lang, c.code)
      console.log('result:', res)
    } catch (e) {
      console.error('error', e)
    }
  }
}

test()
