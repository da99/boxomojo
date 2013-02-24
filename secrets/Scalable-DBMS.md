
Intro
===============================================

*Problem:* The most complicated querys  fro OLTP mass market
websites are: news feeds.

*Answer:* Group items into publication/author.

*Benefits:* 
  1. No more flood of writes (pre-caching of news feeds)
  or tons of RAM needed or lots of space for caching.
  2. You can now order each group by importnce of user.
  3. Better Industrial Design: User is not flooded with
  information from loudmouth friends who take lots of
  photos and write lots of boring stuff.
  4. More features can be easily added because you
  have one row, not a bunch of rows.

Old:

  01/01/01 at 12:09 am - dr who-t: writes he hates dalek-ys.
  01/01/01 at 12:08 am - ms hones: writes he loves dalek-ys.
  01/01/01 at 12:07 am - mr tee-t: writes he tolerates dalek-ys.
  01/01/01 at 12:06 am - dr who-t: writes he hates cybermen-ys.
  01/01/01 at 12:06 am - dr who-t: writes he hates mondays.
  01/01/01 at 12:06 am - dr who-t: writes he hates .....
  01/01/01 at 12:06 am - dr who-t: writes he hates .....


New:

  01/01/01 at 12:09 am - dr who-t: writes he hates dalek-ys.
    + 3 other items...
  01/01/01 at 12:08 am - ms hones: writes he loves dalek-ys.
  01/01/01 at 12:07 am - mr tee-t: writes he tolerates dalek-ys.

You can implement AND optimize this in either MongoDB, Cassandra, RethinkDB,
  etc.


In other words: the problem was not engineering based,
   but industrial design-based. I just saved you millions of
   dollars. All you have to do is accept the geniues of it.
