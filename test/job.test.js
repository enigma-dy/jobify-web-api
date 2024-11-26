import chai from "chai";
import chaiHttp from "chai-http";
import appPath from './setup.js'
import app from appPath;
import Job from "../models/Job";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Create Job", () => {
  beforeEach(async () => {
    await Job.deleteMany({}); // delete all jobs before each test
  });

  it("should create a new job", async () => {
    const jobData = {
      title: "Test Job",
      company: "Test Company",
      salary: 50000,
      jobType: "Full-time",
      requirement: "Test requirement",
      createdBy: "Test User",
    };

    const res = await chai.request(app).post("/jobs").send(jobData);

    expect(res).to.have.status(201);
    expect(res.body).to.be.an("object");
    expect(res.body.title).to.equal(jobData.title);
    expect(res.body.company).to.equal(jobData.company);
    expect(res.body.salary).to.equal(jobData.salary);
    expect(res.body.jobType).to.equal(jobData.jobType);
    expect(res.body.requirement).to.equal(jobData.requirement);
    expect(res.body.createdBy).to.equal(jobData.createdBy);
  });

  it("should return 400 if title is missing", async () => {
    const jobData = {
      company: "Test Company",
      salary: 50000,
      jobType: "Full-time",
      requirement: "Test requirement",
      createdBy: "Test User",
    };

    const res = await chai.request(app).post("/jobs").send(jobData);

    expect(res).to.have.status(400);
    expect(res.body).to.be.an("object");
    expect(res.body.message).to.equal("Please fill all required fields");
  });

  it("should return 400 if company is missing", async () => {
    const jobData = {
      title: "Test Job",
      salary: 50000,
      jobType: "Full-time",
      requirement: "Test requirement",
      createdBy: "Test User",
    };

    const res = await chai.request(app).post("/jobs").send(jobData);

    expect(res).to.have.status(400);
    expect(res.body).to.be.an("object");
    expect(res.body.message).to.equal("Please fill all required fields");
  });

  it("should return 400 if salary is missing", async () => {
    const jobData = {
      title: "Test Job",
      company: "Test Company",
      jobType: "Full-time",
      requirement: "Test requirement",
      createdBy: "Test User",
    };

    const res = await chai.request(app).post("/jobs").send(jobData);

    expect(res).to.have.status(400);
    expect(res.body).to.be.an("object");
    expect(res.body.message).to.equal("Please fill all required fields");
  });

  it("should return 400 if jobType is missing", async () => {
    const jobData = {
      title: "Test Job",
      company: "Test Company",
      salary: 50000,
      requirement: "Test requirement",
      createdBy: "Test User",
    };

    const res = await chai.request(app).post("/jobs").send(jobData);

    expect(res).to.have.status(400);
    expect(res.body).to.be.an("object");
    expect(res.body.message).to.equal("Please fill all required fields");
  });

  it("should return 400 if requirement is missing", async () => {
    const jobData = {
      title: "Test Job",
      company: "Test Company",
      salary: 50000,
      jobType: "Full-time",
      createdBy: "Test User",
    };

    const res = await chai.request(app).post("/jobs").send(jobData);

    expect(res).to.have.status(400);
    expect(res.body).to.be.an("object");
    expect(res.body.message).to.equal("Please fill all required fields");
  });

  it("should return 400 if createdBy is missing", async () => {
    const jobData = {
      title: "Test Job",
      company: "Test Company",
      salary: 50000,
      jobType: "Full-time",
      requirement: "Test requirement",
    };

    const res = await chai.request(app).post("/jobs").send(jobData);

    expect(res).to.have.status(400);
    expect(res.body).to.be.an("object");
    expect(res.body.message).to.equal("Please fill all required fields");
  });

  it("should return 500 if server error occurs", async () => {
    const jobData = {
      title: "Test Job",
      company: "Test Company",
      salary: 50000,
      jobType: "Full-time",
      requirement: "Test requirement",
      createdBy: "Test User",
    };

    // mock server error
    const originalCreate = Job.create;
    Job.create = () => {
      throw new Error("Mock server error");
    };

    const res = await chai.request(app).post("/jobs").send(jobData);

    expect(res).to.have.status(500);
    expect(res.body).to.be.an("object");
    expect(res.body.message).to.equal("Server error");

    // restore original create function
    Job.create = originalCreate;
  });
});
