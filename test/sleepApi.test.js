// test/sleepApi.test.js
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const Store = require('../store');

const should = chai.should(); // Enable should style assertions
chai.use(chaiHttp);

describe('Sleep API', () => {
    before(async () => {
     
    });

    after(async () => {
        // Disconnect and clean up the test database
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
    
        // Clear the test database before each test
        await Store.deleteMany({});
    });


// Testing Post
describe('POST /sleep', () => {
    it('should add a new sleep record', (done) => {
        const sleepData = {
            userId: 'user123',
            hours: 7,
            timestamp: new Date().toISOString(),
        };
        chai.request(app)
            .post('/sleep')
            .send(sleepData)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.an('object');
                res.body.should.have.property('userId', sleepData.userId);
                res.body.should.have.property('hours', sleepData.hours);
                res.body.should.have.property('timestamp');
                done();
            });
    });

    it('should return 400 if required fields are missing', (done) => {
        chai.request(app)
            .post('/sleep')
            .send({ userId: 'user123' })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.an('object');
                res.body.should.have.property('message', 'userId, hours, and timestamp are required fields');
                done();
            });
    });

    it('should return 400 if hours is invalid', (done) => {
        const invalidData = {
            userId: 'user123',
            hours: 25,
            timestamp: new Date().toISOString(),
        };
        chai.request(app)
            .post('/sleep')
            .send(invalidData)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.an('object');
                res.body.should.have.property('message', 'hours must be a valid positive number and in the range 1-24');
                done();
            });
    });

    it('should return 400 if timestamp is invalid', (done) => {
        const invalidData = {
            userId: 'user123',
            hours: 7,
            timestamp: 'invalid-date',
        };
        chai.request(app)
            .post('/sleep')
            .send(invalidData)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.an('object');
                res.body.should.have.property('message', 'timestamp must be a valid date');
                done();
            });
    });

    it('should return 400 if record already exists', async () => {
        const sleepData = {
            userId: 'user123',
            hours: 7,
            timestamp: new Date().toISOString(),
        };
        await new Store(sleepData).save();

        chai.request(app)
            .post('/sleep')
            .send(sleepData)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.an('object');
                res.body.should.have.property('message', 'Record already exists');
            });
    });
});

// Testing Get
describe('GET /sleep/:userId', () => {
    it('should retrieve sleep records for a user', (done) => {
        const sleepData = [
            { userId: 'user123', hours: 7, timestamp: new Date('2023-01-01').toISOString() },
            { userId: 'user123', hours: 8, timestamp: new Date('2023-01-02').toISOString() },
        ];
        Store.insertMany(sleepData)
            .then(() => {
                chai.request(app)
                    .get('/sleep/user123')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('array').that.has.lengthOf(2);
                        done();
                    });
            })
            .catch((err) => {
                done(err); // Call done with error if insertMany fails
            });
    });

    it('should return 404 if no records found for a user', (done) => {
        chai.request(app)
            .get('/sleep/nonexistentuser')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.an('object');
                res.body.should.have.property('message', 'No records found for the specified userId');
                done();
            });
    });
});


   // Testing Delete
   describe('DELETE /sleep/:recordId', () => {
    it('should delete a sleep record by ID', async () => {
        try {
            // Create and save a new record
            const temp = {
                userId: 'user123',
                hours: 7,
                timestamp: new Date().toISOString(),
            };
            const savedRecord = await new Store(temp).save();
            // Send a DELETE request to delete the record
            const response = await chai.request(app).delete(`/sleep/${savedRecord._id}`);
            // Assertions
            response.should.have.status(200);
            response.body.should.be.an('object');
            response.body.should.have.property('message', 'Record has been deleted');
        } catch (error) {
            throw error;
        }
    });

 // For not finding a record
    it('should return 404 if record not found', (done) => {
        const nonExistentId = new mongoose.Types.ObjectId();
        chai.request(app)
            .delete(`/sleep/${nonExistentId}`)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                try {
                    res.should.have.status(404);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message', 'No record found, Cannot be deleted');
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

});

});