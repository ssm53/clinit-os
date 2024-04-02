import ioClient from 'socket.io-client';
import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
const socket = ioClient(PUBLIC_BACKEND_BASE_URL, {
	transports: ['websocket']
});

export const io = socket;
