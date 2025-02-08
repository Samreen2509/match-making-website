
const validateEditRequest = (req) =>{
   const allowedEditFields = ["firstName", "lastName", "age", "about", "skill", "gender"];

   const isEditAllowd = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
);
return isEditAllowd;
};

module.exports = {validateEditRequest,};