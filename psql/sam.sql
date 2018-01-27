create table test (
        NAME char(80) primary key,
	AGE integer not null
);

insert into test values ('Michael Jackson', 50);
insert into test values ('DJ Khaled', 42);
insert into test values ('Post Malone', 22);

select * from test;

select * from test where  Name='DJ Khaled';

update test set age = 22 where name= 'Post Malone';

select * from test;

delete from test where age='50';

select * from test;
