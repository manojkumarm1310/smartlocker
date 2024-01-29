

export default function RecipientContactValidation(values)
{
    const  error= {};
    const nameValidation=/^[A-Za-z\s]+$/;
    const contactValidation=/^\d{10}$/;
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
    if(values.customerContact==="")
    {
        error.contact="Number Should be entered";
    }
    else if (!contactValidation.test(values.customerContact)) {
        error.contact="Invalid number; must be ten digits";
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