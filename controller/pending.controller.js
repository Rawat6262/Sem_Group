let PendingDocument = require('../models/pendingdocument.model');
exports.getpendingdocuments = async (req, res) => {
  try {
    if(!req.params.warehouse_id || !req.params.exhibition_id){
      return res.status(400).json({
        success: false, 
        message: "warehouse_id and exhibition_id are required",
        }); 
    }
    const pendingDocuments = await PendingDocument.findOne({warehouse_id: req.params.warehouse_id,exhibition_id: req.params.exhibition_id}).populate('exhibition_id').populate('warehouse_id');
     if(!pendingDocuments){
      return res.status(404).json({
        success: false, 
        message: "No pending documents found for the given warehouse and exhibition",
        }); 
    }
    return res.status(200).json({
      success: true,
      data: pendingDocuments,
    });

   
  } catch (error) {
    return res.status(400).json({
      success: false,
        message: error.message,
    });
  } 
};