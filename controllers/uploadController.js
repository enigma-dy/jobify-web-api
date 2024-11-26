import Document from "../models/documentModel.js";

export const uploadDocument = async (req, res) => {
  try {
    let fileUrl;
    
    
    if (req.body.fileUrl && req.body.fileUrl.startsWith("file://")) {
      fileUrl = req.body.fileUrl;
    } else if (req.file) {
      
      fileUrl = req.file.path; 
    } else {
      return res.status(400).json({ message: "No valid file or file URL provided" });
    }

   
    const document = new Document({
      user: req.user.id, 
      type: req.body.type,
      fileUrl: fileUrl,
    });

    await document.save();

    res.status(200).json({
      status: "success",
      message: "Document uploaded successfully",
      data: { document },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
