
/* switch to wallabag db */
use wallabag;

/* reassign a label and delete the old one(S)*/
update wallabag_entry_tag set tag_id = ? where tag_id in (?,?); delete from wallabag_tag where id in (?,?);

/* rename a label */
update wallabag_tag set label='?', slug='?' where id='?';

/* show tags with low frequency */
select tag_id, count(entry_id) entry_counts from wallabag_entry_tag group by tag_id having count(entry_id) < 3;


/* create a temporary table of tag_id, entry_id where the count is less than 3*/
create temporary table if not exists tag_counts as (select tag_id, count(entry_id) entry_counts from wallabag_entry_tag group by tag_id having count(entry_id) < 3);

/* deletes the associations of tags that weren't that frequent */
delete from wallabag_entry_tag where tag_id in (select tag_id from tag_counts);
