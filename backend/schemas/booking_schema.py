class BookingValidator:
    """
    Booking Validation
    """

    @staticmethod
    def validate_booking(data):

        errors = {}

        event_id = data.get("event_id")
        number_of_tickets = data.get("number_of_tickets")

        # ==========================================================
        # Event Validation
        # ==========================================================

        if not event_id:
            errors["event_id"] = "Event ID is required."

        # ==========================================================
        # Ticket Validation
        # ==========================================================

        if number_of_tickets is None:
            errors["number_of_tickets"] = "Number of tickets is required."

        else:
            try:
                number_of_tickets = int(number_of_tickets)

                if number_of_tickets <= 0:
                    errors["number_of_tickets"] = "Number of tickets must be greater than zero."

                elif number_of_tickets > 10:
                    errors["number_of_tickets"] = "Maximum 10 tickets can be booked."

            except (TypeError, ValueError):
                errors["number_of_tickets"] = "Number of tickets must be an integer."

        return errors