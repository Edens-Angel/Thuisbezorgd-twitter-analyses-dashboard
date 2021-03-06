from sqlalchemy.sql.elements import Null
from sqlalchemy import Table, Column, Integer, String, ForeignKey
from sqlalchemy.types import DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_method
from sqlalchemy import text, func, and_
from .database import db

hashtag_tweet = Table(
    'hashtag_tweet', getattr(db, '_base').metadata,
    Column('tweet_id', String(255), ForeignKey('tweet.id')),
    Column('hashtag_id', Integer, ForeignKey('hashtag.id'))
)


class Tweet(getattr(db, '_base')):
    __tablename__ = 'tweet'

    id = Column(String(255), primary_key=True, index=True)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False)
    user_id = Column(String(255), index=True, nullable=False)
    user_geo_enabled = Column(Boolean, nullable=False)
    user_screenname = Column(String(50), nullable=False)
    user_location = Column(String(50))
    retweet_count = Column(Integer, nullable=False)
    user_verified = Column(Boolean, nullable=False)
    emoji = Column(String(255))

    hashtags = relationship('Hashtag', secondary=hashtag_tweet, back_populates='tweets')

    def __repr__(self):
        return '<Tweet(user={}, geo_enabled={}, verified={}, text={})>'.format(
            self.user_screenname, self.user_geo_enabled,
            self.user_verified, self.text
        )

    @hybrid_method
    def get_day_filter(self, date_filter):
        return func.date(self.created_at) == date_filter

    @hybrid_method
    def get_daily_filter(self):
        return func.date(self.created_at) == func.current_date()

    @hybrid_method
    def get_weekly_filter(self):
        return and_(
            self.created_at >= func.date_sub(func.date(func.now()), text('INTERVAL 7 DAY')),
            func.year(self.created_at) == func.year(func.now())
        )

    @hybrid_method
    def get_monthly_filter(self):
        return self.created_at > func.date_sub(func.now(), text('INTERVAL 1 MONTH'))

    @hybrid_method
    def get_filter_by_param(self, query, param):
        if param == 'm':
            query = query.filter(self.get_monthly_filter())

        if param == 'w':
            query = query.filter(self.get_weekly_filter())

        if param == 'd':
            query = query.filter(self.get_daily_filter())

        return query


class Hashtag(getattr(db, '_base')):
    __tablename__ = 'hashtag'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150), nullable=False, unique=True)

    tweets = relationship('Tweet', secondary=hashtag_tweet, back_populates='hashtags')

    def __repr__(self):
        return '<Hashtag(id={}, name={})>'.format(self.id, self.name)


class ProcessedTweet(getattr(db, '_base')):
    __tablename__ = 'processed_tweet'

    id = Column(String(255), primary_key=True, index=True)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False)

    def __repr__(self):
        return '<ProcessedTweet(id={}, text={})>'.format(
            self.id, self.text
        )

    @hybrid_method
    def get_day_filter(self, date_filter):
        return func.date(self.created_at) == date_filter

    @hybrid_method
    def get_daily_filter(self):
        return func.date(self.created_at) == func.current_date()

    @hybrid_method
    def get_weekly_filter(self):
        return and_(
            self.created_at >= func.date_sub(func.date(func.now()), text('INTERVAL 7 DAY')),
            func.year(self.created_at) == func.year(func.now())
        )

    @hybrid_method
    def get_monthly_filter(self):
        return self.created_at > func.date_sub(func.now(), text('INTERVAL 1 MONTH'))

    @hybrid_method
    def get_filter_by_param(self, query, param):
        if param == 'm':
            query = query.filter(self.get_monthly_filter())

        if param == 'w':
            query = query.filter(self.get_weekly_filter())

        if param == 'd':
            query = query.filter(self.get_daily_filter())

        return query
