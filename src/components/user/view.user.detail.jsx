import { Button, Drawer, notification } from "antd";
import { useState } from "react";
import { handleUploadFile, updateUserAvatarAPI } from "../../services/api.service";


const ViewUserDetail = (props) => {
    const {
        dataDetail,
        setDataDetail,
        isDetailOpen,
        setIsDetailOpen,
        loadUser
    } = props;

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleOnChangeFile = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            setSelectedFile(null);
            setPreview(null);
            return;
        }
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file))
        };
        console.log(">>> check file: ", preview);
    }
    const handleUpdateUserAvatar = async () => {
        //step1: upload file
        const resUpload = await handleUploadFile(selectedFile, "avatar");
        if (resUpload.data) {
            const newAvatar = resUpload.data.fileUploaded;


            //step 2: update user

            const resUpdateAvatar = await updateUserAvatarAPI(newAvatar, dataDetail._id, dataDetail.fullName, dataDetail.phone);

            if (resUpdateAvatar.data) {
                setIsDetailOpen(false);
                setSelectedFile(null);
                setPreview(null);
                await loadUser();



                notification.success({
                    message: "Update user avatar",
                    description: "cap nhat avatar thanh cong"
                })
            } else {
                notification.error({
                    message: "Error upload avatar",
                    description: JSON.stringify(resUpdateAvatar.message)
                })
            }
            //success
        } else {
            //failed
            notification.error({
                message: "error upload file",
                description: JSON.stringify(resUpload.message)
            })
            return;
        }

    }
    return (
        <Drawer
            width={"40vw"}
            title="chi tiet user"
            onClose={() => {
                setDataDetail(null);
                setIsDetailOpen(false);
            }}
            open={isDetailOpen}
        >
            {dataDetail ? <>
                <p>Id: {dataDetail._id}</p>
                <br />
                <p>Full name: {dataDetail.fullName}</p>
                <br />
                <p>Email: {dataDetail.email}</p>
                <br />
                <p>Phone number: {dataDetail.phone}</p>
                <br />
                <p>Avatar: </p>
                <div style={{
                    marginTop: "10px",
                    height: "100px", width: "150px",
                    border: "1px solid #ccc"
                }}>
                    <img
                        style={{ height: "100%", width: "100%", objectFit: "contain" }}
                        height={100} width={150}
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataDetail.avatar}`}
                    />
                </div>
                <div>
                    <label htmlFor="btnUpload"
                        style={{
                            display: "block",
                            width: "fit-content",
                            marginTop: "15px",
                            padding: "5px 10px",
                            background: "orange",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Upload Avatar
                    </label>
                    <input
                        type="file" hidden id="btnUpload"
                        // onChange={handleOnChangeFile}
                        onChange={(event) => handleOnChangeFile(event)}
                    />
                </div>

                {preview &&
                    <>
                        <div style={{
                            marginTop: "10px",
                            marginBottom: "15px",
                            height: "100px", width: "150px",

                        }}>
                            <img
                                style={{ height: "100%", width: "100%", objectFit: "contain" }}
                                height={100} width={150}
                                src={preview}
                            />
                        </div>
                        <Button
                            type="primary"
                            onClick={() => handleUpdateUserAvatar()}
                        >
                            Save
                        </Button>
                    </>
                }
            </>
                :
                <>
                    <p>Khong co du lieu</p>
                </>
            }

        </Drawer>
    )
}
export default ViewUserDetail;