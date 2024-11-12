create table regions
(
    region_id   int auto_increment
        primary key,
    region_name varchar(255) not null
);

create table stores
(
    store_id   int auto_increment
        primary key,
    store_name varchar(255) not null,
    owner_id   int          not null,
    address    varchar(255) null,
    region_id  int          not null,
    constraint store_region_fk
        foreign key (region_id) references regions (region_id)
);

create table missions
(
    mission_id       int auto_increment
        primary key,
    store_id         int                               not null,
    mission_content  text                              not null,
    mission_status   enum ('in_progress', 'completed') not null,
    review_left      tinyint(1) default 0              null,
    success_owner_id int                               null,
    constraint mission_store_fk
        foreign key (store_id) references stores (store_id)
);

create table users
(
    user_id    int auto_increment
        primary key,
    created_at datetime(6) null
);

create table food_choices
(
    choice_id   int auto_increment
        primary key,
    user_id     int          not null,
    food_item   varchar(255) not null,
    choice_date date         not null,
    constraint food_choices_ibfk_1
        foreign key (user_id) references users (user_id)
);

create table reviews
(
    review_id      int auto_increment
        primary key,
    mission_id     int                                 not null,
    user_id        int                                 not null,
    rating         tinyint(1)                          null,
    review_content text                                null,
    created_at     timestamp default CURRENT_TIMESTAMP null,
    constraint review_mission_fk
        foreign key (mission_id) references missions (mission_id),
    constraint review_user_fk
        foreign key (user_id) references users (user_id),
    check ((`rating` >= 1) and (`rating` <= 5))
);

create table terms_agreement
(
    agreement_id          int auto_increment
        primary key,
    user_id               int        null,
    all_agreed            tinyint(1) not null,
    service_terms_agreed  tinyint(1) not null,
    privacy_policy_agreed tinyint(1) not null,
    location_agreed       tinyint(1) null,
    marketing_agreed      tinyint(1) null,
    constraint terms_agreement_ibfk_1
        foreign key (user_id) references users (user_id)
);

create index user_id
    on terms_agreement (user_id);

create table user_details
(
    details_id int auto_increment
        primary key,
    user_id    int          null,
    name       varchar(255) not null,
    birthdate  date         not null,
    gender     varchar(50)  null,
    address    varchar(255) null,
    constraint user_details_ibfk_1
        foreign key (user_id) references users (user_id)
);

create index user_id
    on user_details (user_id);

create table user_missions
(
    user_mission_id int auto_increment
        primary key,
    user_id         int  not null,
    mission_id      int  not null,
    completed_date  date null,
    constraint user_mission_mission_fk
        foreign key (mission_id) references missions (mission_id),
    constraint user_mission_user_fk
        foreign key (user_id) references user_details (user_id)
);

create table user_points
(
    user_id                  int           not null,
    region_id                int           not null,
    points                   int default 0 not null,
    total_missions_completed int default 0 not null,
    constraint user_points_region_fk
        foreign key (region_id) references regions (region_id),
    constraint user_points_user_fk
        foreign key (user_id) references user_details (user_id)
);

