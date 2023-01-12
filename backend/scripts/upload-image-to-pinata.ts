import pinataSDK from "@pinata/sdk";
import path from "path";
import fs from "fs";

const pinata: pinataSDK = new pinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_API_SECRET
);

const IMAGE_FILE_PATH: string = "images/nft-cat.png";

async function uploadImage(): Promise<void> {
    if (IMAGE_FILE_PATH == "") {
        console.log("IMAGE FILE PATH IS EMPTY, PLEASE ADD IT.");
        return;
    }

    try {
        const fullImagePath = path.resolve(IMAGE_FILE_PATH);
        const readableStreamForFile = fs.createReadStream(fullImagePath);
        const response = await pinata.pinFileToIPFS(readableStreamForFile, {
            pinataMetadata: { name: "nft-cat.png" },
        });
        console.log(response);
        // * You need to copy the `IpfsHash` from the response for later use or you can also get it from the your pinata dashboard.
    } catch (error) {
        console.log(error);
    }
}

uploadImage()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
