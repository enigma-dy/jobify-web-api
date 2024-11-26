import Document from "../models/documentModel.js";

export const uploadDocument = async (req, res) => {
  try {
    const document = new Document({
      user: req.user.id,
      type: req.body.type,
      fileUrl: req.file.path,
    });

    await document.save();

    res.status(200).json({
      status: "success",
      message: "Document uploaded successfully",
      data: {
        document,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
