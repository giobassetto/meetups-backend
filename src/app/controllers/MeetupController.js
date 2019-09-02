import { parseISO, startOfHour, isBefore } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const { title, description, location, date } = req.body;
    console.log(req.body);

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Invalid date, Past dates' });
    }
    try {
      const meetup = await Meetup.create({
        title,
        description,
        location,
        date,
        user_id: req.userId,
        image_id: req.body.image_id && req.body.image_id,
      });

      return res.json({ meetup, message: 'OK' });
    } catch (err) {
      return res.json({ error: err });
    }
  }
}

export default new MeetupController();
