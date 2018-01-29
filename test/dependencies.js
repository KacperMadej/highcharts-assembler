'use strict'
const {
  describe,
  it
} = require('mocha')
const expect = require('chai').expect
const defaults = require('../src/dependencies.js')

describe('dependencies.js', () => {
  describe('exported properties', () => {
    it('has export default', () => {
      expect(defaults).to.have.property('cleanPath')
        .that.is.a('function')
      expect(defaults).to.have.property('compileFile')
        .that.is.a('function')
      expect(defaults).to.have.property('regexGetCapture')
        .that.is.a('function')
    })
  })
  describe('expJavaScriptComment', () => {
    const exp = defaults.expJavaScriptComment
    it('matches single line comments', () => {
      const string = `var test // single line`
      expect(string.replace(exp, '')).to.equal(`var test `)
    })
    it('matches single line comments, with multi line inside', () => {
      const string = `var test // single line /* and multi line */`
      expect(string.replace(exp, '')).to.equal(`var test `)
    })
    it('matches multi line comments', () => {
      const string = `var first /* comment line
        * comment line
        */ var second`
      expect(string.replace(exp, '')).to.equal(`var first  var second`)
    })
    it('matches multi line comments, with single line inside', () => {
      const string = `var test /* multi line // and single line */`
      expect(string.replace(exp, '')).to.equal(`var test `)
    })
  })
  describe('getFileImports', () => {
    const getFileImports = defaults.getFileImports
    it('returns empty array when input is not a string', () => {
      expect(getFileImports(undefined)).to.deep.equal([])
    })
    it('returns tuples of path to module, and the variable name', () => {
      const string = `
      import var1 from 'module1'
      var something = var1.something
      import var2 from 'module2'
      // import notImport from 'module3'
      import 'module4'
      /* import notImport from 'module5' */
      /*
      import notImport from 'module6'
      */
      `
      expect(getFileImports(string)).to.deep.equal([
        ['module1', 'var1'],
        ['module2', 'var2'],
        ['module4', null]
      ])
    })
  })
  describe('getImportInfo', () => {
    const getImportInfo = defaults.getImportInfo
    /**
     * Syntax for the `import` statement can be found at:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
     */
    it('should support importing defaults', () => {
      expect(getImportInfo(`import defaultExport from 'module-name'`))
        .to.deep.equal(['module-name', 'defaultExport'])
    })
    it('should support importing for side effects only', () => {
      expect(getImportInfo(`import 'module-name'`))
        .to.deep.equal(['module-name', null])
    })
    it('should support single quotes', () => {
      expect(getImportInfo(`import 'module-name'`))
        .to.deep.equal(['module-name', null])
    })
    it('should support double quotes', () => {
      expect(getImportInfo(`import "module-name"`))
        .to.deep.equal(['module-name', null])
    })
  })
  describe('isInsideSingleComment', () => {
    const isInsideSingleComment = defaults.isInsideSingleComment
    it('should return true if is index is inside a comment', () => {
      expect(isInsideSingleComment('// comment', 0)).to.equal(true)
      expect(isInsideSingleComment('const a = 1 // comment', 0)).to.equal(false)
      const str = `
      // comment 1
      const a = 1 // comment 2
      // comment 3`
      expect(isInsideSingleComment(str, str.indexOf('comment 1'))).to.equal(true)
      expect(isInsideSingleComment(str, str.indexOf('comment 2'))).to.equal(true)
      expect(isInsideSingleComment(str, str.indexOf('comment 3'))).to.equal(true)
      expect(isInsideSingleComment(str, str.indexOf('const a'))).to.equal(false)
    })
  })
  describe('isInsideBlockComment', () => {
    it('should return true if index is inside a block comment', () => {
      const isInsideBlockComment = defaults.isInsideBlockComment
      expect(isInsideBlockComment('/**/', 2)).to.equal(true)
      expect(isInsideBlockComment('/**/ ', 4)).to.equal(false)
      expect(isInsideBlockComment('*/', 1)).to.equal(false)
      expect(isInsideBlockComment('/* comment */', 3)).to.equal(true)
      const str1 = `
        /**
         * comment 1
         */
        const a;
      `
      expect(isInsideBlockComment(str1, str1.indexOf('comment 1'))).to.equal(true)
      expect(isInsideBlockComment(str1, str1.indexOf('const a'))).to.equal(false)
      const str2 = `
        // /* comment 1
        const a
        // */
      `
      expect(isInsideBlockComment(str2, str2.indexOf('comment 1'))).to.equal(false)
      expect(isInsideBlockComment(str2, str2.indexOf('const a'))).to.equal(false)
      expect(isInsideBlockComment('const a', 2)).to.equal(false)
    })
  })
  describe('isImportStatement', () => {
    const isImportStatement = defaults.isImportStatement
    it('should return false when input is not a String', () => {
      expect(isImportStatement()).to.equal(false)
    })
    it(`should return false when input is // import 'module'`, () => {
      expect(isImportStatement(`// import 'module'`)).to.equal(false)
    })
    it(`should return false when input is /* import 'module' */`, () => {
      expect(isImportStatement(`/* import 'module' */`)).to.equal(false)
    })
    it(`should return true when input is import 'module'`, () => {
      expect(isImportStatement(`import 'module'`)).to.equal(true)
    })
    it(`should return true when input is import a from 'module'`, () => {
      expect(isImportStatement(`import a from 'module'`)).to.equal(true)
    })
    it(`should return true when input is import { a } from 'module'`, () => {
      expect(isImportStatement(`import { a } from 'module'`)).to.equal(true)
    })
  })
  describe('removeFirstBlockComment', () => {
    const removeFirstBlockComment = defaults.removeFirstBlockComment
    it('should remove first block comment', () => {
      expect(removeFirstBlockComment('/**/')).to.equal('')
      expect(removeFirstBlockComment('/* comment */')).to.equal('')
      expect(removeFirstBlockComment('const a = 1 /*/ comment not closed'))
        .to.equal('const a = 1 ')
      expect(removeFirstBlockComment('const a = 1 /* a comment */ const b = 2'))
        .to.equal('const a = 1  const b = 2')
      expect(removeFirstBlockComment('/* comment1 *//* comment2 */'))
        .to.equal('/* comment2 */')
      expect(removeFirstBlockComment('const a = 1')).to.equal('const a = 1')
    })
    it(`should return '' when input is not a string`, () => {
      expect(removeFirstBlockComment(undefined)).to.equal('')
      expect(removeFirstBlockComment(null)).to.equal('')
      expect(removeFirstBlockComment(false)).to.equal('')
      expect(removeFirstBlockComment(1)).to.equal('')
      expect(removeFirstBlockComment({})).to.equal('')
      expect(removeFirstBlockComment([])).to.equal('')
      expect(removeFirstBlockComment(function () {})).to.equal('')
    })
  })
  describe('removeFirstSingleLineComment', () => {
    const removeFirstSingleLineComment = defaults.removeFirstSingleLineComment
    it('should remove first single line comment', () => {
      expect(removeFirstSingleLineComment('// comment')).to.equal('')
      expect(removeFirstSingleLineComment('// comment\n// comment')).to.equal('\n// comment')
      expect(removeFirstSingleLineComment('// comment// comment')).to.equal('')
      expect(removeFirstSingleLineComment('const a = 1 // comment')).to.equal('const a = 1 ')
    })
    it(`should return '' when input is not a string`, () => {
      expect(removeFirstSingleLineComment(undefined)).to.equal('')
      expect(removeFirstSingleLineComment(null)).to.equal('')
      expect(removeFirstSingleLineComment(false)).to.equal('')
      expect(removeFirstSingleLineComment(1)).to.equal('')
      expect(removeFirstSingleLineComment({})).to.equal('')
      expect(removeFirstSingleLineComment([])).to.equal('')
      expect(removeFirstSingleLineComment(function () {})).to.equal('')
    })
  })
})
