
process.env.NODE_ENV = 'test';

import chai from 'chai';
import chaiHttp	from 'chai-http';
import app from '../server'

chai.use(chaiHttp);
chai.should();

console.log("Started")

module.exports = { chai, app};
