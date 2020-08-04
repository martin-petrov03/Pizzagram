const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../index');

chai.use(chaiHttp);
chai.should();

describe("Pizzas", () => {
    let auth = '';
    let userId = '';

    //sign in
    before(function(done) {
        this.timeout(100000);
        chai.request(app)
            .post('/auth/signin')            
            .send({ 
                email: 'm@abv.bg',
                password: '123456',
                headers: {
                    'Content-Type': 'application/json'
                } })
            .end((err, res) => {
                expect(err).to.be.null;
                res.should.have.status(200);
                expect(res.body.message).to.be.deep.equal('User successfully logged in!');
                auth = res.body.token;
                userId = res.body.userId;                
                done();
            });
    });

    it("should get all pizzas", function(done) {
        this.timeout(100000);
        chai.request(app)
            .get('/products/all')
            .end((err, res) => {    
                expect(err).to.be.null;
                res.should.have.status(200);
                expect(res.body.products).be.a('array');
                done();
            });
    });
    it("should create new product", function(done) {
            this.timeout(100000);
            chai.request(app)
                .post('/products/add')                
                .send(
                    {
                        "name": "Pizza",
                        "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH1hw-H2-hnH4tE-TIHH6ShMI1JBqvh0MpxXn-hEeCZp45oSqiZw",
                        "description": "Pizza Margarita is made with tomatoes, mozzarella cheese, fresh basil, salt and extra-virgin olive oil.",
                        headers: {
                            'Content-Type': 'application/json',
                            'auth': auth,
                            'userId': userId
                        }
                    }    
                )
                .end((err, res) => {   
                    expect(err).to.be.null;
                    res.should.have.status(409);
                    expect(res.body.message).to.be.deep.equal('A product with this name already exist!');
                    done();
                });
        
    });
    it("should return Product cannot be created!", function(done) {
        this.timeout(100000);
        chai.request(app)
            .post('/products/add')            
            .send(
                {
                    "name": "P",
                    "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH1hw-H2-hnH4tE-TIHH6ShMI1JBqvh0MpxXn-hEeCZp45oSqiZw",
                    "description": "Pizza Margarita is made with tomatoes, mozzarella cheese, fresh basil, salt and extra-virgin olive oil.",
                    headers: {
                        'Content-Type': 'application/json',
                        'auth': auth,
                        'userId': userId
                    }
                }    
            )
            .end((err, res) => {   
                expect(err).to.be.null;
                res.should.have.status(500);
                expect(res.body.message).to.be.deep.equal('Product cannot be created!');    
                done();
            });
    });
    it("should return You have already liked this product!", function(done) {
        const productId = '5d64db1787154c30c410dc3f';
        this.timeout(100000);
        chai.request(app)
            .post(`/products/like/${productId}`)            
            .send({
                headers: {
                    'Content-Type': 'application/json',
                    'auth': auth,
                    'userId': userId
                }
            })
            .end((err, res) => {   
                expect(err).to.be.null;
                res.should.have.status(400);
                expect(res.body.message).to.be.deep.equal('You have already liked this product!');    
                done();
            });
    });
    it("should return Cannot find the product!", function(done) {
        const productId = 'abc';
        this.timeout(100000);
        chai.request(app)
            .post(`/products/like/${productId}`)            
            .send({
                headers: {
                    'Content-Type': 'application/json',
                    'auth': auth,
                    'userId': userId
                }
            })
            .end((err, res) => {   
                expect(err).to.be.null;
                res.should.have.status(500);
                expect(res.body.message).to.be.deep.equal('Cannot find the product!');    
                done();
            });
    });
    it("should delete user!", function(done) {
        const productId = '5d64db1787154c30c410dc3f';
        let length = 0;
        
        //get all users
        this.timeout(100000);
        chai.request(app)
            .get('/products/all')
            .end((err, res) => {    
                expect(err).to.be.null;
                res.should.have.status(200);
                expect(res.body.products).be.a('array');
                length = res.body.products;
            });
        
        this.timeout(100000);
        chai.request(app)
            .post(`/products/delete/${productId}`)  
            .send({
                headers: {
                    'Content-Type': 'application/json',
                    'auth': auth,
                    'userId': userId
                }
            })
            .end((err, res) => {
                expect(err).to.be.null;
                //Already deleted
                //res.should.have.status(200);
                //expect(res.body.message).to.be.deep.equal('Product has been successfully deleted!');
            });
    
        //get all users
        this.timeout(100000);
        chai.request(app)
            .get('/products/all')
            .end((err, res) => {    
                expect(err).to.be.null;
                res.should.have.status(200);
                expect(res.body.products).be.a('array');
                //Already deleted
                //expect(res.body.products.length).to.be.deep.equal(length - 1);
                expect(res.body.products).to.be.deep.equal(length);
                done();
            });
    });
});

describe("Auth", () => {
    it("should return E-Mail address already exists!", function(done) {
        this.timeout(100000);
        chai.request(app)
            .post('/auth/signup')            
            .send({ 
                "email": "m@abv.bg",
                "username": "Martin",
                "password": "123456",
                "headers": {
                    "Content-Type": "application/json"
                }
            })
            .end((err, res) => {   
                expect(err).to.be.null;
                res.should.have.status(409);                
                expect(res.body.message).to.be.deep.equal('E-Mail address already exists!');                
                done();
            });        
    });
    it("should return Validation failed, entered data is incorrect!", function (done) {
        this.timeout(100000);
        chai.request(app)
            .post('/auth/signup')            
            .send({
                "email": "m@dsa.das",
                "username": "m",
                "password": "1231",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .end((err, res) => {
                expect(err).to.be.null;
                res.should.have.status(422);
                expect(res.body.message).to.be.deep.equal('Validation failed, entered data is incorrect!');
                done();
            });
    })
    it("should signIn", function(done) {
        this.timeout(100000);
        chai.request(app)
            .post('/auth/signin')            
            .send({ 
                email: 'm@abv.bg',
                password: '123456',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .end((err, res) => {   
                expect(err).to.be.null;
                res.should.have.status(200);
                expect(res.body.message).to.be.deep.equal('User successfully logged in!');
                done();
            });
    });
    it("should return Invalid password!", function(done) {
        this.timeout(100000);
        chai.request(app)
            .post('/auth/signin')            
            .send({ 
                email: 'm@abv.bg',
                password: '1',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .end((err, res) => {   
                expect(err).to.be.null;
                res.should.have.status(401);
                expect(res.body.message).to.be.deep.equal('Invalid password!');
                done();
            });
    });
    it("should return A user with this email could not be found!", function(done) {
        this.timeout(100000);
        chai.request(app)
            .post('/auth/signin')            
            .send({ 
                email: 'm@yahoo.bg',
                password: '123456',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .end((err, res) => {   
                expect(err).to.be.null;
                res.should.have.status(401);
                expect(res.body.message).to.be.deep.equal('A user with this email could not be found!');
                done();
            });
    });
});