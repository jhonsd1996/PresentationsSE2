class WelcomeMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.welcome_mailer.notify.subject
  #
  def notify(person)

    @person = person
    mail to: person.email, subject: "Welcome"
  end
end
