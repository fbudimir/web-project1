import QRCode from "qrcode";

export const generateQR = async (text: string) => {
	try {
		const qr = await QRCode.toDataURL(text);
		return qr;
	} catch (err) {
		console.error("Error generating QR code", err);
	}
};
