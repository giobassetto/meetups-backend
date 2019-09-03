import { parseISO, startOfHour, isBefore } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const { title, description, location, date } = req.body;

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Invalid date, Past dates' });
    }

    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      user_id: req.userId,
      image_id: req.body.image_id && req.body.image_id,
    });

    return res.json({ meetup, message: 'OK' });
  }
}

export default new MeetupController();
