
/* switch to wallabag db */
use wallabag;

/* reassign a label and delete the old one(S)*/
update wallabag_entry_tag set tag_id = ? where tag_id in (?,?); delete from wallabag_tag where id in (?,?);

/* rename a label */
update wallabag_tag set label='?', slug='?' where id='?';

