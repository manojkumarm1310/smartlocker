

export default function RecipientContactValidation(values)
{
    const  error= {};
    const nameValidation=/^[A-Za-z\s]+$/;
    const contactValidation=/^(0|91)?[6-9][0-9]{9}$/;
    if(values.customerName==="")
    {
        error.name="Name should be entered";
    }
    else if(!nameValidation.test(values.customerName))
    {   
        error.name="invalid name";
    }
    else{
        error.name="";
    }
    let contactNumber="91"+values.customerContact;
    if(values.customerContact==="")
    {
        error.contact="Number Should be entered";
    }
    else if (!contactValidation.test(contactNumber)) {
        error.contact="Invalid number";
    } else {
        error.contact="";
    }
    
    if(values.DoorNumber<0 && values.DoorNumber>9)
    {
        error.DoorNumber="Wrong number";
    }
    else
    {
        error.DoorNumber=""
    }
    return  error;
}