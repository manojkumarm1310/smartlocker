

export default function DeliveryContactValidation(values)
{
    const  error= {};
    const nameValidation=/^[A-Za-z\s]+$/;
    const contactValidation=/^\d{10}$/;
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
    if(values.contact==="")
    {
        error.contact="Number Should be entered";
    }
    else if (!contactValidation.test(values.contact)) {
        error.contact="Invalid number";
    } else {
        error.contact="";
    }
    return  error;
}