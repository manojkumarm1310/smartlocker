

export default function DeliveryContactValidation(values)
{
    const  error= {};
    const nameValidation=/^[A-Za-z\s]+$/;
    const contactValidation=/^(0|91)?[6-9][0-9]{9}$/;
    if(values.name==="")
    {
        error.name="Name should be entered";
    }
    else if(!nameValidation.test(values.name))
    {   
        error.name="invalid name";
    }
    else{
        error.name="";
    }
    let contactNumber="91"+values.contact;
    if(values.contact==="")
    {
        error.contact="Number Should be entered";
    }
    else if (!contactValidation.test(contactNumber)) {
        error.contact="Invalid number";
    } else {
        error.contact="";
    }
    return  error;
}