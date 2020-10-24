import { Router } from 'express';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.get('/', (request, response) =>
  response.json(appointmentsRepository.all())
);

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = parseISO(date);
  const appointmentInSameDate = appointmentsRepository.findByDate(parsedDate);

  if (appointmentInSameDate) {
    return response
      .status(400)
      .json({ message: 'This appointment is already booked' });
  }

  const appointment = appointmentsRepository.create(provider, parsedDate);

  return response.json(appointment);
});

export default appointmentsRouter;
