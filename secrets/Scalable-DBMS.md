
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

Note: Quora.com may have provided the final push to this solution by seeing
how others do it poorly (ie lots of RAM, caching, and money):
  1. http://www.quora.com/Activity-Streams/What-are-the-scaling-issues-to-keep-in-mind-while-developing-a-social-network-feed
  2. http://www.quora.com/What-are-best-practices-for-building-something-like-a-News-Feed
By seeing how the overpaid engineers do it, I felt that I have considered all
  possible techniques.  The only thing technique left was the "pre-GROUP\_BY"
  approach (described above).
Also note: I have been thinking about this intensely (and off/on) for the past 3+ years.
  The final step was to finally see how the "big boys" solved it. Quora.com's answers
  were easier to find than the StackExchanged websites. Maybe because Quora is being
  used as water-cooler talk by smart people. Water-cooler talk is not allowed on StackExchange.
  Quora.com is more for the retail customer, StackExchange is for the serious, uptight
  professional.

My previous designs: copying the data to a cluster and using
a SQL-dbms to query the data with a copy of the users subscriptions near
the query cluster. The one before that was: generation of news feed for each user
after a new record is inserted, but I gave it up when I realized it led to a flood of writes.





