

const isValideUpdateData = (data, Data) => {
    // using destructuring of body data.
    const { fname, lname, email, phone, password, address } = data;

    //Input data validation
    let msgUserData = isValidUserData.isValidRequest(data)
    if (msgUserData) {
        return res.status(400).send({ status: false, message: msgUserData })
    }

    if (fname) {
        let msgFnameData = isValidUserData.isValidName(fname)
        if (msgFnameData) {
            return res.status(400).send({ status: false, message: msgFnameData })
        }
    }

    if (lname) {
        let msgLnameData = isValidUserData.isValidName(lname)
        if (msgLnameData) {
            return res.status(400).send({ status: false, message: msgLnameData })
        }
    }

    if (email) {
        let msgEmailData = isValidUserData.isValidEmail(email)
        if (msgEmailData) return msgEmailData

        if (Data.email === email) return `email: ${email} already exist`;
    }

    if (phone) {
        let msgPhoneData = isValidUserData.isValidPhone(phone)
        if (msgPhoneData) return msgPhoneData

        if (Data.phone === phone) return `mobile number: ${phone} already exist`;
    }

    if (address) {
        data.address = JSON.parse(address)
        let msgAddressData = isValidUserData.isValidAdd(data.address)
        if (msgAddressData) return msgAddressData
    }
    
}




const updatedvalid  = async(req, Data) => {
            let { fname, lname, email, profileImage, phone, password, address } = req;

            if (email) {
                if (email) return res.status(400).send({ status: false, message: "Please enter Valid Email" })
                let checkEmail = await UserModel.findOne({ email: email })
                if (checkEmail) return res.status(400).send({ status: false, message: "email is already Exist" })
                data.email = email;
            }
            if (phone) {
                if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: "Please enter Valid phone number" })
                let checkphone = await UserModel.findOne({ phone: phone });
                if (checkphone) return res.status(400).send({ status: false, message: "This phone number is already Present" })
                data.phone = phone;
            }
            if (fname) {
                if (fname !== "string") return res.status(400).send({ status: false, message: "fname should be string" })
                data.fname = fname;
            }
            if (lname) { 
                if (lname !== "string") return res.status(400).send({ status: false, message: "fname should be string" })
                data.lname = lname; }

            if (address) {
                data.address.billing 
            }


            if (profileImage) data.profileImage = profileImage;
            if (password) data.password = password;
        }