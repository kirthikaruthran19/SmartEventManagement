from datetime import datetime


class EventValidator:
    """
    Event Validation
    """

    @staticmethod
    def validate_event(data):

        errors = {}

        title = data.get("title", "").strip()
        description = data.get("description", "").strip()
        location = data.get("location", "").strip()
        event_date = data.get("event_date", "").strip()
        event_time = data.get("event_time", "").strip()
        ticket_price = data.get("ticket_price")
        available_seats = data.get("available_seats")
        organizer = data.get("organizer", "").strip()
        registration_deadline = data.get("registration_deadline", "").strip()
        category_id = data.get("category_id")

        if not title:
            errors["title"] = "Title is required."

        if not description:
            errors["description"] = "Description is required."

        if not location:
            errors["location"] = "Location is required."

        if not event_date:
            errors["event_date"] = "Event date is required."
        else:
            try:
                datetime.strptime(event_date, "%Y-%m-%d")
            except ValueError:
                errors["event_date"] = "Date must be YYYY-MM-DD."

        if not event_time:
            errors["event_time"] = "Event time is required."
        else:
            try:
                datetime.strptime(event_time, "%H:%M")
            except ValueError:
                errors["event_time"] = "Time must be HH:MM."

        if ticket_price is None:
            errors["ticket_price"] = "Ticket price is required."
        elif float(ticket_price) < 0:
            errors["ticket_price"] = "Ticket price cannot be negative."

        if available_seats is None:
            errors["available_seats"] = "Available seats are required."
        elif int(available_seats) <= 0:
            errors["available_seats"] = "Available seats must be greater than zero."

        if not organizer:
            errors["organizer"] = "Organizer is required."

        if not registration_deadline:
            errors["registration_deadline"] = "Registration deadline is required."
        else:
            try:
                datetime.strptime(registration_deadline, "%Y-%m-%d")
            except ValueError:
                errors["registration_deadline"] = "Date must be YYYY-MM-DD."

        if not category_id:
            errors["category_id"] = "Category is required."

        return errors