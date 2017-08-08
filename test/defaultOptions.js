'use strict'
import { describe, it } from 'mocha'
import { expect } from 'chai'
import defaults from '../src/defaultOptions.js'

describe('defaultOptions.js', () => {
  it('has export default', () => {
    expect(defaults).to.be.a('object')
  })
  it('has a property base', () => {
    expect(defaults).to.have.property('base', null)
  })
  it('has a property date', () => {
    expect(defaults).to.have.property('date', null)
  })
  it('has a property exclude', () => {
    expect(defaults).to.have.property('exclude', null)
  })
  it('has a property fileOptions', () => {
    expect(defaults).to.have.property('fileOptions')
    expect(defaults.fileOptions).to.be.an('object')
  })
  it('has a property files', () => {
    expect(defaults).to.have.property('files', null)
  })
  it('has a property jsBase', () => {
    expect(defaults).to.have.property('jsBase', null)
  })
  it('has a property output', () => {
    expect(defaults).to.have.property('output', './')
  })
  it('has a property palette', () => {
    expect(defaults).to.have.property('palette', null)
  })
  it('has a property pretty', () => {
    expect(defaults).to.have.property('pretty', true)
  })
  it('has a property product', () => {
    expect(defaults).to.have.property('product', 'Highcharts')
  })
  it('has a property umd', () => {
    expect(defaults).to.have.property('umd', true)
  })
  it('has a property version', () => {
    expect(defaults).to.have.property('version', 'x.x.x')
  })
  it('has a property transpile', () => {
    expect(defaults).to.have.property('transpile', false)
  })
  it('has a property type', () => {
    expect(defaults).to.have.property('type', 'classic')
  })
})
