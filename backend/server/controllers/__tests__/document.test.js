import { jest } from '@jest/globals';
import AWSService from "../../services/AWSService.js";
import db from "../../models/index.js";
import documentController from "../document.js";


jest.mock("../../services/AWSService.js");
jest.mock("../../models/index.js", () => ({
  __esModule: true,
  default: {
    documents: {
      create: jest.fn(),
    },
    sequelize: {
      sync: jest.fn(() => Promise.resolve()), // Mock sync to resolve immediately
      authenticate: jest.fn(() => Promise.resolve()), // Mock authenticate to resolve immediately
    },
  },
}));

describe('summarise_document', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      user: { id: 'testUserId' },
      file: { originalname: 'test.pdf', buffer: Buffer.from('test content') },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Reset mocks before each test
    AWSService.mockClear();
    db.documents.create.mockClear();
  });

  it('should successfully summarise a document and return uniqueId and summary', async () => {
    await documentController.summarise_document(req, res);

    expect(res.status).not.toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      id: expect.any(String),
      summary: "Summary of test content",
    }));
    expect(db.documents.create).toHaveBeenCalledTimes(1);
    expect(db.documents.create).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'testUserId',
      s3Path: expect.stringContaining('users/testUserId/'),
      summary: "Summary of test content",
      title: "Test Title",
      tags: ["test", "test2"],
    }));
  });

  // it('should return 400 if file is missing', async () => {
  //   req.file = undefined;

  //   await documentController.summarise_document(req, res);

  //   expect(res.status).toHaveBeenCalledWith(400);
  //   expect(res.json).toHaveBeenCalledWith({ error: "Invalid request. Missing file or user." });
  //   expect(db.documents.create).not.toHaveBeenCalled();
  // });

  // it('should return 400 if user is missing', async () => {
  //   req.user = undefined;

  //   await documentController.summarise_document(req, res);

  //   expect(res.status).toHaveBeenCalledWith(400);
  //   expect(res.json).toHaveBeenCalledWith({ error: "Invalid request. Missing file or user." });
  //   expect(db.documents.create).not.toHaveBeenCalled();
  // });

  // it('should handle errors during summarization', async () => {
  //   req.file.buffer = Buffer.from("error_text_summarization");

  //   await documentController.summarise_document(req, res);

  //   expect(res.status).toHaveBeenCalledWith(500);
  //   expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining("An error occurred") });
  //   expect(db.documents.create).not.toHaveBeenCalled();
  // });

  // it('should handle errors during title generation', async () => {
  //   await documentController.summarise_document(req, res);

  //   expect(res.status).toHaveBeenCalledWith(500);
  //   expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining("An error occurred") });
  //   expect(db.documents.create).not.toHaveBeenCalled();
  // });

  // it('should handle errors during tag generation', async () => {
  //   await documentController.summarise_document(req, res);

  //   expect(res.status).toHaveBeenCalledWith(500);
  //   expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining("An error occurred") });
  //   expect(db.documents.create).not.toHaveBeenCalled();
  // });

  // it('should handle errors during database creation', async () => {
  //   db.documents.create.mockRejectedValueOnce(new Error("Database error"));

  //   await documentController.summarise_document(req, res);

  //   expect(res.status).toHaveBeenCalledWith(500);
  //   expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining("An error occurred") });
  // });

  // it('should return a 200 status for successful summarization', async () => {
  //   await documentController.summarise_document(req, res);

  //   expect(res.status).toHaveBeenCalledWith(200);
  //   // TODO Inspect the response to see if the summary, title and tags are correct
  // });
}); 