
/* switch to wallabag db */
use wallabag;

/* reassign a label and delete the old one(S)*/
update wallabag_entry_tag set tag_id = ? where tag_id in (?,?); delete from wallabag_tag where id in (?,?);

/* rename a label */
update wallabag_tag set label='?', slug='?' where id='?';

/* show tags with low frequency */
select label, tag_id, count(entry_id) entry_counts from wallabag_entry_tag join wallabag_tag on wallabag_entry_tag.tag_id = wallabag_tag.id group by tag_id having count(entry_id) < 3;
/*
+----------------------+--------+--------------+
| label                | tag_id | entry_counts |
+----------------------+--------+--------------+
| proxy                |    850 |            1 |
| gitbook              |    854 |            1 |
| sitecore             |    855 |            1 |
| material             |    856 |            1 |
| modern.enterprise    |    858 |            2 |
| pwa                  |    859 |            2 |
| machine.learning     |    860 |            1 |
| podcast              |    861 |            1 |
| test                 |    862 |            1 |
| react.native         |    863 |            1 |
| vue                  |    864 |            1 |
| express              |    867 |            1 |
| devops               |    869 |            1 |
| yarn                 |    871 |            1 |
| software.development |    872 |            1 |
+----------------------+--------+--------------+
*/

/* create a temporary table of tag_id, entry_id where the count is less than 3*/
create temporary table if not exists tag_counts as (select tag_id, count(entry_id) entry_counts from wallabag_entry_tag group by tag_id having count(entry_id) < 3);

/* deletes the associations of tags that weren't that frequent */
delete from wallabag_entry_tag where tag_id in (select tag_id from tag_counts);

/* show duplicates by title for a specific user -- if you don't specify you can delete other's links unknowingly */
select id, user_id, count(*) as title_counts, title from wallabag_entry where user_id=1 group by title having count(title) >1;

/*
+------+---------+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| id   | user_id | title_counts | title                                                                                                                                                                |
+------+---------+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 4328 |       1 |            2 | Your Application running on Private Clouds                                                                                                                           |
|  599 |       1 |           10 | ZeeMee Engineering and the Quest for the Holy (Mobile Dev) Grail                                                                                                     |
| 4360 |       1 |            2 | Zengineering Blog                                                                                                                                                    |
+------+---------+--------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------+
*/

/* create temporary table of [entry_]id, user_id, title_counts, title where count is greater than 1 */
create temporary table if not exists title_counts as (select id, user_id, count(*) as title_counts, title from wallabag_entry where user_id=1 group by title having count(title) >1);

/* deletes at least 1 duplicate entry that was found since the duplicate find query only gets 1 id of many */
delete from wallabag_entry where id in (select id from title_counts);
