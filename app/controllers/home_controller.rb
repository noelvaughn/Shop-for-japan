class HomeController < ApplicationController
  def index
  end
  
  def map_markers
    @companies = Company.find(:all)
  end

  def participants
    @companies = Company.find(:all)
  end

  def login
  end
end
