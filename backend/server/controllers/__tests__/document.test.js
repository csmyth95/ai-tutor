import { jest } from '@jest/globals';
import { Pipeline } from "@huggingface/transformers";
import AWSService from "../../services/AWSService.js";
import db from "../../models/index.js";
import documentController from "../document.js";

// **TODO Configure this so the unit tests can run without Sequlelize initialisation**

// Mock external modules
jest.mock("@huggingface/transformers", () => ({
  Pipeline: jest.fn(() => jest.fn((text) => {
    if (text === "error_text_summarization") {
      throw new Error("Summarization failed");
    }
    return [{ generated_text: `Summary of ${text}` }];
  })),
}));

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
    Pipeline.mockClear();
    AWSService.mockClear();
    db.documents.create.mockClear();
  });

  it('should successfully summarise a document and return uniqueId and summary', async () => {
    // Mock the LLM pipeline for title and tags
    Pipeline.mockImplementationOnce(() => jest.fn((prompt) => {
      if (prompt.includes("title")) {
        return [{ generated_text: "Test Title" }];
      }
      if (prompt.includes("tags")) {
        return [{ generated_text: "test, test2" }];
      }
      return [{ generated_text: "" }];
    }));

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

  it('should return 400 if file is missing', async () => {
    req.file = undefined;

    await documentController.summarise_document(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid request. Missing file or user." });
    expect(db.documents.create).not.toHaveBeenCalled();
  });

  it('should return 400 if user is missing', async () => {
    req.user = undefined;

    await documentController.summarise_document(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid request. Missing file or user." });
    expect(db.documents.create).not.toHaveBeenCalled();
  });

  it('should handle errors during summarization', async () => {
    req.file.buffer = Buffer.from("error_text_summarization");

    await documentController.summarise_document(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining("An error occurred") });
    expect(db.documents.create).not.toHaveBeenCalled();
  });

  it('should handle errors during title generation', async () => {
    // Mock the LLM pipeline to throw an error for title generation
    Pipeline.mockImplementationOnce(() => jest.fn((prompt) => {
      if (prompt.includes("title")) {
        throw new Error("Title generation failed");
      }
      if (prompt.includes("tags")) {
        return [{ generated_text: "test, test2" }];
      }
      return [{ generated_text: "" }];
    }));

    await documentController.summarise_document(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining("An error occurred") });
    expect(db.documents.create).not.toHaveBeenCalled();
  });

  it('should handle errors during tag generation', async () => {
    // Mock the LLM pipeline to throw an error for tag generation
    Pipeline.mockImplementationOnce(() => jest.fn((prompt) => {
      if (prompt.includes("title")) {
        return [{ generated_text: "Test Title" }];
      }
      if (prompt.includes("tags")) {
        throw new Error("Tag generation failed");
      }
      return [{ generated_text: "" }];
    }));

    await documentController.summarise_document(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining("An error occurred") });
    expect(db.documents.create).not.toHaveBeenCalled();
  });

  it('should handle errors during database creation', async () => {
    db.documents.create.mockRejectedValueOnce(new Error("Database error"));

    // Mock the LLM pipeline for title and tags
    Pipeline.mockImplementationOnce(() => jest.fn((prompt) => {
      if (prompt.includes("title")) {
        return [{ generated_text: "Test Title" }];
      }
      if (prompt.includes("tags")) {
        return [{ generated_text: "test, test2" }];
      }
      return [{ generated_text: "" }];
    }));

    await documentController.summarise_document(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: expect.stringContaining("An error occurred") });
  });

  it('should return a 200 status for successful summarization', async () => {
    // Mock the LLM pipeline for title and tags
    Pipeline.mockImplementationOnce(() => jest.fn((prompt) => {
      if (prompt.includes("title")) {
        return [{ generated_text: "Test Title" }];
      }
      if (prompt.includes("tags")) {
        return [{ generated_text: "test, test2" }];
      }
      return [{ generated_text: "" }];
    }));

    await documentController.summarise_document(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
}); 