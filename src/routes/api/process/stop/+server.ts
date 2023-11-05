import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { processService } from '$lib/server/services/process.service';
import { getAuthenticatedUser } from '$lib/server/helpers/auth.helper';

export const POST: RequestHandler = async ({ request }) => {
	const user = await getAuthenticatedUser(request);
	if (!user.admin) throw error(403, 'You are not allowed to run this action');

	if (!processService.isCurrentProcessing) throw error(400, 'There is no process to cancel.');

	processService.stopProcessing();

	return json({ message: 'Process has been cancelled' });
};
