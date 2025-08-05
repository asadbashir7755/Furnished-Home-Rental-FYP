import { useFormContext } from "../FormContext";
import BasicInfoForm from "./ManageitemsComponents/Basicform";
import AddressForm from "./ManageitemsComponents/AddressForm";
import MediaForm from "./ManageitemsComponents/MediaForm";
import AmenitiesForm from "./ManageitemsComponents/AmenitiesForm";
import PriceForm from "./ManageitemsComponents/PriceForm";
import ReviewForm from "./ManageitemsComponents/ReviewForm";

const Forms = () => {
  const { activeTab } = useFormContext();

  return (
    <div>
      {activeTab === "basic" && <BasicInfoForm />}
      {activeTab === "address" && <AddressForm />}
      {activeTab === "media" && <MediaForm />}
      {activeTab === "amenities" && <AmenitiesForm />}
      {activeTab === "price" && <PriceForm />}
      {activeTab === "review" && <ReviewForm />}

    </div>
  );
};

export default Forms;
