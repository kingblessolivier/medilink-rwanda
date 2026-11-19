"""Wave 6 part A catalogue events (contract sprint-09 §11, analysis 09 §4).

Texts are neutral ("a visit", not "your visit") because guardians receive their dependants'
notices with the same template. No clinical words: no service, medicine or diagnosis names.
Kinyarwanda drafts need native-speaker review before go-live (#11).
"""

from __future__ import annotations

from datetime import timedelta

from medilink.notifications.registry import EventDefinition, Placeholder, Text

P = Placeholder

BOOKING_CONFIRMED = "scheduling.booking.confirmed"
BOOKING_CANCELLED = "scheduling.booking.cancelled"
BOOKING_CHANGED = "scheduling.booking.changed"
BOOKING_NO_SHOW = "scheduling.booking.no_show"
TICKET_CALLED = "queue.ticket.called"
TICKET_ALMOST = "queue.ticket.almost"
TICKET_PASS_OVER = "queue.ticket.pass_over"  # noqa: S105 (an event name)
RX_READY = "pharmacy.prescription.ready"
RX_DISPENSED = "pharmacy.prescription.dispensed"
RX_TO_DISPENSE = "pharmacy.prescription.to_dispense"
RX_QUERY = "pharmacy.query.raised"
DOCUMENT_READY = "documents.document.ready"
APPLICATION_SUBMITTED = "onboarding.application.submitted"
MERGE_REQUESTED = "patients.merge.requested"
# W7 (upgrade 13): patient follow-through
TICKET_CALLED_DESK = "queue.ticket.called_desk"
LAB_RESULT_READY = "clinical.lab_result.ready"
BOOKING_REMINDER = "scheduling.booking.reminder"
# "It's time" (decision 2026-11-19): 15 minutes before and at the start, always on
BOOKING_SOON = "scheduling.booking.soon"
BOOKING_NOW = "scheduling.booking.now"
FOLLOW_UP_DUE = "scheduling.follow_up.due"
CARE_SCHEDULE_DUE = "scheduling.care_schedule.due"


def _texts(
    channels: tuple[str, ...], by_language: dict[str, tuple[str, str]]
) -> dict[tuple[str, str, str], Text]:
    return {
        (channel, language, "self"): Text(subject, body)
        for channel in channels
        for language, (subject, body) in by_language.items()
    }


PATIENT_ALL = ("in_app", "web_push", "email")
PATIENT_LIVE = ("in_app", "web_push")
WHEN = {"facility_name": P.FACILITY_NAME, "date": P.DATE, "time": P.TIME}

T_CONFIRMED = {
    "rw": (
        "Gahunda yemejwe",
        "Gahunda yo kwivuza kuri $facility_name yemejwe ku wa $date saa $time.",
    ),
    "en": ("Booking confirmed", "A visit at $facility_name is booked for $date at $time."),
    "fr": ("Rendez-vous confirmé", "Une visite à $facility_name est réservée le $date à $time."),
}
T_CANCELLED = {
    "rw": (
        "Gahunda yahagaritswe",
        "$facility_name yahagaritse gahunda yo ku wa $date saa $time. Fungura MediLink ufate "
        "indi saha.",
    ),
    "en": (
        "Booking cancelled",
        "$facility_name cancelled the visit on $date at $time. Open MediLink to book another time.",
    ),
    "fr": (
        "Rendez-vous annulé",
        "$facility_name a annulé la visite du $date à $time. Ouvrez MediLink pour choisir une "
        "autre heure.",
    ),
}
T_CHANGED = {
    "rw": (
        "Gahunda yahinduwe",
        "$facility_name yahinduye gahunda: ubu ni ku wa $date saa $time. Fungura MediLink "
        "wemeze cyangwa uhitemo indi saha.",
    ),
    "en": (
        "Booking changed",
        "$facility_name changed a visit: it is now on $date at $time. Open MediLink to keep it "
        "or choose another time.",
    ),
    "fr": (
        "Rendez-vous modifié",
        "$facility_name a modifié une visite : elle est maintenant le $date à $time. Ouvrez "
        "MediLink pour la garder ou choisir une autre heure.",
    ),
}
T_NO_SHOW = {
    "rw": (
        "Gahunda itubahirijwe",
        "Ntimwaje kuri gahunda yo kuri $facility_name ku wa $date. Iyo bibaye kenshi, gufata "
        "gahunda kuri interineti bihagarara igihe gito.",
    ),
    "en": (
        "Missed visit recorded",
        "Nobody came to the visit at $facility_name on $date. After several missed visits, "
        "online booking pauses for a while.",
    ),
    "fr": (
        "Visite manquée enregistrée",
        "Personne n'est venu à la visite à $facility_name le $date. Après plusieurs visites "
        "manquées, la réservation en ligne est suspendue un moment.",
    ),
}
T_CALLED = {
    "rw": ("Igihe kirageze: $room", "Tike $ticket_number: genda kuri $room ubu."),
    "en": ("It's your turn: $room", "Ticket $ticket_number: please go to $room now."),
    "fr": ("C'est votre tour : $room", "Ticket $ticket_number : allez à $room maintenant."),
}
T_ALMOST = {
    "rw": (
        "Hasigaye abantu $count",
        "Tike $ticket_number: hasigaye abantu $count imbere yawe kuri $facility_name. Guma hafi.",
    ),
    "en": (
        "$count people before you",
        "Ticket $ticket_number: $count people before you at $facility_name. Please stay close.",
    ),
    "fr": (
        "$count personnes avant vous",
        "Ticket $ticket_number : $count personnes avant vous à $facility_name. Restez à proximité.",
    ),
}
T_PASS_OVER = {
    "rw": (
        "Emeza ko uhari",
        "Tike $ticket_number igeze imbere kuri $facility_name. Emeza ko uhari bitaba ibyo "
        "isubizwe inyuma.",
    ),
    "en": (
        "Confirm you are here",
        "Ticket $ticket_number is near the front at $facility_name. Confirm you are here or it "
        "moves back.",
    ),
    "fr": (
        "Confirmez que vous êtes là",
        "Le ticket $ticket_number approche du début de la file à $facility_name. Confirmez que "
        "vous êtes là, sinon il recule.",
    ),
}
T_RX_READY = {
    "rw": ("Imiti iriteguye", "Resept yiteguye kuri farumasi ya $facility_name."),
    "en": ("Medicines ready", "A prescription is ready at the $facility_name pharmacy."),
    "fr": ("Médicaments prêts", "Une ordonnance est prête à la pharmacie de $facility_name."),
}
T_RX_DISPENSED = {
    "rw": (
        "Farumasi yanditse imiti yatanzwe",
        "Farumasi ya $facility_name yanditse imiti yatanze. Reba Imiti yanjye umenye ibisigaye "
        "kugurwa hanze.",
    ),
    "en": (
        "The pharmacy recorded the medicines",
        "The $facility_name pharmacy recorded what it gave. Open My medicines to see anything "
        "left to buy outside.",
    ),
    "fr": (
        "La pharmacie a enregistré les médicaments",
        "La pharmacie de $facility_name a enregistré ce qu'elle a donné. Ouvrez Mes médicaments "
        "pour voir ce qui reste à acheter ailleurs.",
    ),
}
T_TO_DISPENSE = {
    "rw": ("Resept nshya", "Resept nshya itegereje gutangwa kuri farumasi."),
    "en": ("New prescription to dispense", "A new prescription is waiting at the pharmacy."),
    "fr": ("Nouvelle ordonnance à délivrer", "Une nouvelle ordonnance attend à la pharmacie."),
}
T_QUERY = {
    "rw": (
        "Ikibazo cya farumasi",
        "Umufarumasiye yabajije ikibazo kuri resept wasinye. Yifungure usubize.",
    ),
    "en": (
        "Question from the pharmacy",
        "The pharmacist asked about a prescription you signed. Open it to answer.",
    ),
    "fr": (
        "Question de la pharmacie",
        "Le pharmacien a posé une question sur une ordonnance que vous avez signée. Ouvrez-la "
        "pour répondre.",
    ),
}
T_DOCUMENT = {
    "rw": (
        "Inyandiko nshya iriteguye",
        "$facility_name yasinye inyandiko nshya. Fungura Inyandiko zanjye uyikuremo.",
    ),
    "en": (
        "New document ready",
        "$facility_name signed a new document. Open My documents to download it.",
    ),
    "fr": (
        "Nouveau document prêt",
        "$facility_name a signé un nouveau document. Ouvrez Mes documents pour le télécharger.",
    ),
}
T_APPLICATION = {
    "rw": ("Ubusabe bushya bw'ivuriro", "$facility_name yasabye kwinjira muri MediLink."),
    "en": ("New facility application", "$facility_name applied to join MediLink."),
    "fr": ("Nouvelle demande d'établissement", "$facility_name a demandé à rejoindre MediLink."),
}
T_MERGE = {
    "rw": (
        "Gusaba guhuza amadosiye",
        "Ivuriro ryasabye guhuza amadosiye abiri y'umurwayi. Bisuzume.",
    ),
    "en": ("Merge request to review", "A facility asked to merge two patient records. Review it."),
    "fr": (
        "Demande de fusion à examiner",
        "Un établissement a demandé de fusionner deux dossiers patient. Examinez-la.",
    ),
}

# W7 (upgrade 13): generic on purpose. No test, vaccine or visit-type names: a push shows on the
# lock screen, and "antenatal" alone would tell anyone who sees it that the patient is pregnant.
T_CALLED_DESK = {
    "rw": (
        "Igihe kirageze",
        "Tike $ticket_number: murahamagawe kuri $facility_name. Muze ubu.",
    ),
    "en": (
        "It's your turn",
        "Ticket $ticket_number: you are being called at $facility_name. Please come now.",
    ),
    "fr": (
        "C'est votre tour",
        "Ticket $ticket_number : on vous appelle à $facility_name. Venez maintenant.",
    ),
}
T_LAB_READY = {
    "rw": (
        "Igisubizo kiriteguye",
        "$facility_name yohereje igisubizo. Fungura MediLink ugisome hamwe n'icyo muganga "
        "yanditse.",
    ),
    "en": (
        "A result is ready",
        "$facility_name shared a result. Open MediLink to read it with the doctor's note.",
    ),
    "fr": (
        "Un résultat est prêt",
        "$facility_name a partagé un résultat. Ouvrez MediLink pour le lire avec la note du "
        "médecin.",
    ),
}
T_REMINDER = {
    "rw": (
        "Kwibutsa gahunda",
        "Mwibuke: gahunda yo kwivuza kuri $facility_name ku wa $date saa $time.",
    ),
    "en": ("Visit reminder", "Reminder: a visit at $facility_name on $date at $time."),
    "fr": ("Rappel de visite", "Rappel : une visite à $facility_name le $date à $time."),
}
T_SOON = {
    "rw": (
        "Hasigaye iminota 15",
        "Gahunda yo kwivuza kuri $facility_name iratangira mu minota 15, saa $time.",
    ),
    "en": ("Your visit is in 15 minutes", "Your visit at $facility_name starts at $time."),
    "fr": ("Votre visite dans 15 minutes", "Votre visite à $facility_name commence à $time."),
}
T_NOW = {
    "rw": (
        "Igihe kirageze",
        "Igihe cya gahunda yanyu kuri $facility_name kirageze (saa $time).",
    ),
    "en": ("It's time for your visit", "Your visit at $facility_name is now ($time)."),
    "fr": (
        "C'est l'heure de votre visite",
        "Votre visite à $facility_name, c'est maintenant ($time).",
    ),
}
T_FOLLOW_UP = {
    "rw": (
        "Igihe cyo kugaruka",
        "$facility_name yasabye ko mugaruka ku wa $date. Fungura MediLink mufate isaha.",
    ),
    "en": (
        "A return visit is due",
        "$facility_name asked for a return visit on $date. Open MediLink to book a time.",
    ),
    "fr": (
        "Une visite de retour est prévue",
        "$facility_name a demandé une visite de retour le $date. Ouvrez MediLink pour choisir "
        "une heure.",
    ),
}
T_CARE_SCHEDULE = {
    "rw": (
        "Gahunda iteganyijwe iregereje",
        "Gahunda iteganyijwe kuri $facility_name ni ku wa $date.",
    ),
    "en": ("A planned visit is coming up", "A planned visit at $facility_name is due on $date."),
    "fr": (
        "Une visite prévue approche",
        "Une visite prévue à $facility_name est due le $date.",
    ),
}

# Patient app pages (upgrade 12 §2): the signed-in app lives under /dashboard; the frontend still
# redirects the older /visits, /medicines and /documents addresses already sent.
APPOINTMENT_PATH = "/dashboard/appointments/{booking_id}"
TICKET_PATH = "/dashboard/queue/{visit_id}"
MEDICATION_PATH = "/dashboard/medications/{prescription_id}"
DOCUMENT_PATH = "/dashboard/documents/{document_id}"
APPOINTMENTS_PATH = "/dashboard/appointments"
RECORDS_PATH = "/dashboard/records"

EVENTS: list[EventDefinition] = [
    EventDefinition(
        type=BOOKING_CONFIRMED,
        audience="patient",
        priority="important",
        channels=PATIENT_ALL,
        placeholders=WHEN,
        data_keys=frozenset({"booking_id"}),
        action_path=APPOINTMENT_PATH,
        dedupe="{type}:{booking_id}",
        templates=_texts(PATIENT_ALL, T_CONFIRMED),
    ),
    EventDefinition(
        type=BOOKING_CANCELLED,
        audience="patient",
        priority="important",
        channels=PATIENT_ALL,
        placeholders=WHEN,
        data_keys=frozenset({"booking_id"}),
        action_path=APPOINTMENT_PATH,
        dedupe="{type}:{booking_id}",
        templates=_texts(PATIENT_ALL, T_CANCELLED),
    ),
    EventDefinition(
        type=BOOKING_CHANGED,
        audience="patient",
        priority="important",
        channels=PATIENT_ALL,
        placeholders=WHEN,
        data_keys=frozenset({"booking_id"}),
        action_path=APPOINTMENT_PATH,
        dedupe="{type}:{booking_id}:{date}:{time}",
        templates=_texts(PATIENT_ALL, T_CHANGED),
    ),
    EventDefinition(
        type=BOOKING_NO_SHOW,
        audience="patient",
        priority="important",
        channels=("in_app", "email"),
        placeholders={"facility_name": P.FACILITY_NAME, "date": P.DATE},
        data_keys=frozenset({"booking_id"}),
        action_path=APPOINTMENT_PATH,
        dedupe="{type}:{booking_id}",
        templates=_texts(("in_app", "email"), T_NO_SHOW),
    ),
    EventDefinition(
        type=TICKET_CALLED,
        audience="patient",
        priority="critical",
        channels=PATIENT_LIVE,
        placeholders={"ticket_number": P.TICKET_NUMBER, "room": P.ROOM},
        data_keys=frozenset({"ticket_id", "visit_id"}),
        action_path=TICKET_PATH,
        dedupe="{type}:{ticket_id}:{room}",
        ttl=timedelta(minutes=30),
        templates=_texts(PATIENT_LIVE, T_CALLED),
    ),
    EventDefinition(
        type=TICKET_ALMOST,
        audience="patient",
        priority="critical",
        channels=PATIENT_LIVE,
        placeholders={
            "ticket_number": P.TICKET_NUMBER,
            "count": P.COUNT,
            "facility_name": P.FACILITY_NAME,
        },
        data_keys=frozenset({"ticket_id", "visit_id"}),
        action_path=TICKET_PATH,
        dedupe="{type}:{ticket_id}",
        ttl=timedelta(hours=1),
        templates=_texts(PATIENT_LIVE, T_ALMOST),
    ),
    EventDefinition(
        type=TICKET_PASS_OVER,
        audience="patient",
        priority="critical",
        channels=PATIENT_LIVE,
        placeholders={"ticket_number": P.TICKET_NUMBER, "facility_name": P.FACILITY_NAME},
        data_keys=frozenset({"ticket_id", "visit_id"}),
        action_path=TICKET_PATH,
        dedupe="{type}:{ticket_id}",
        ttl=timedelta(minutes=30),
        templates=_texts(PATIENT_LIVE, T_PASS_OVER),
    ),
    EventDefinition(
        type=RX_READY,
        audience="patient",
        priority="important",
        channels=PATIENT_LIVE,
        placeholders={"facility_name": P.FACILITY_NAME},
        data_keys=frozenset({"prescription_id"}),
        action_path=MEDICATION_PATH,
        dedupe="{type}:{prescription_id}",
        templates=_texts(PATIENT_LIVE, T_RX_READY),
    ),
    EventDefinition(
        type=RX_DISPENSED,
        audience="patient",
        priority="routine",
        channels=("in_app",),
        placeholders={"facility_name": P.FACILITY_NAME},
        data_keys=frozenset({"prescription_id", "record_id"}),
        action_path=MEDICATION_PATH,
        dedupe="{type}:{record_id}",
        templates=_texts(("in_app",), T_RX_DISPENSED),
    ),
    EventDefinition(
        type=RX_TO_DISPENSE,
        audience="staff",
        priority="routine",
        channels=("in_app",),
        data_keys=frozenset({"prescription_id"}),
        action_path="/pharmacy/prescriptions/{prescription_id}",
        dedupe="{type}:{prescription_id}",
        rate_limit=(200, timedelta(hours=1)),
        templates=_texts(("in_app",), T_TO_DISPENSE),
    ),
    EventDefinition(
        type=RX_QUERY,
        audience="staff",
        priority="important",
        channels=("in_app",),
        data_keys=frozenset({"query_id", "consultation_id"}),
        action_path="/clinical/consultations/{consultation_id}",
        dedupe="{type}:{query_id}",
        rate_limit=(50, timedelta(hours=1)),
        templates=_texts(("in_app",), T_QUERY),
    ),
    EventDefinition(
        type=DOCUMENT_READY,
        audience="patient",
        priority="important",
        channels=("in_app", "email"),
        placeholders={"facility_name": P.FACILITY_NAME},
        data_keys=frozenset({"document_id"}),
        action_path=DOCUMENT_PATH,
        dedupe="{type}:{document_id}",
        templates=_texts(("in_app", "email"), T_DOCUMENT),
    ),
    EventDefinition(
        type=APPLICATION_SUBMITTED,
        audience="staff",
        priority="important",
        channels=("in_app", "email"),
        placeholders={"facility_name": P.FACILITY_NAME},
        data_keys=frozenset({"application_id"}),
        action_path="/platform/applications/{application_id}",
        dedupe="{type}:{application_id}",
        rate_limit=(200, timedelta(hours=1)),
        templates=_texts(("in_app", "email"), T_APPLICATION),
    ),
    EventDefinition(
        type=MERGE_REQUESTED,
        audience="staff",
        priority="important",
        channels=("in_app",),
        data_keys=frozenset({"merge_id"}),
        action_path="/platform/merge-requests",
        dedupe="{type}:{merge_id}",
        rate_limit=(200, timedelta(hours=1)),
        templates=_texts(("in_app",), T_MERGE),
    ),
    # ---- W7 (upgrade 13): patient follow-through ----
    EventDefinition(
        type=TICKET_CALLED_DESK,  # a call with no room to name (lab, cashier, pharmacy counters)
        audience="patient",
        priority="critical",
        channels=PATIENT_LIVE,
        placeholders={"ticket_number": P.TICKET_NUMBER, "facility_name": P.FACILITY_NAME},
        data_keys=frozenset({"ticket_id", "visit_id"}),
        action_path=TICKET_PATH,
        dedupe="{type}:{ticket_id}",
        ttl=timedelta(minutes=30),
        templates=_texts(PATIENT_LIVE, T_CALLED_DESK),
    ),
    EventDefinition(
        type=LAB_RESULT_READY,
        audience="patient",
        priority="important",
        channels=PATIENT_ALL,
        placeholders={"facility_name": P.FACILITY_NAME},
        data_keys=frozenset({"lab_order_id"}),
        action_path=RECORDS_PATH,
        dedupe="{type}:{lab_order_id}",
        templates=_texts(PATIENT_ALL, T_LAB_READY),
    ),
    EventDefinition(
        type=BOOKING_REMINDER,
        audience="patient",
        priority="important",
        channels=PATIENT_ALL,
        placeholders=WHEN,
        data_keys=frozenset({"booking_id"}),
        action_path=APPOINTMENT_PATH,
        dedupe="{type}:{booking_id}",  # the reminder job passes one key per offset
        rate_limit=(20, timedelta(hours=1)),
        templates=_texts(PATIENT_ALL, T_REMINDER),
    ),
    *(
        EventDefinition(
            type=event,
            audience="patient",
            priority="important",
            channels=PATIENT_ALL,
            placeholders=WHEN,
            data_keys=frozenset({"booking_id"}),
            action_path=APPOINTMENT_PATH,
            dedupe="{type}:{booking_id}",
            rate_limit=(20, timedelta(hours=1)),
            templates=_texts(PATIENT_ALL, texts),
        )
        for event, texts in ((BOOKING_SOON, T_SOON), (BOOKING_NOW, T_NOW))
    ),
    EventDefinition(
        type=FOLLOW_UP_DUE,
        audience="patient",
        priority="important",
        channels=PATIENT_ALL,
        placeholders={"facility_name": P.FACILITY_NAME, "date": P.DATE},
        data_keys=frozenset({"follow_up_id"}),
        action_path=APPOINTMENTS_PATH,
        dedupe="{type}:{follow_up_id}",
        rate_limit=(20, timedelta(hours=1)),
        templates=_texts(PATIENT_ALL, T_FOLLOW_UP),
    ),
    EventDefinition(
        type=CARE_SCHEDULE_DUE,
        audience="patient",
        priority="important",
        channels=PATIENT_ALL,
        placeholders={"facility_name": P.FACILITY_NAME, "date": P.DATE},
        data_keys=frozenset({"entry_id"}),
        action_path=APPOINTMENTS_PATH,
        dedupe="{type}:{entry_id}",
        rate_limit=(20, timedelta(hours=1)),
        templates=_texts(PATIENT_ALL, T_CARE_SCHEDULE),
    ),
]
