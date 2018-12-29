# Like Rack::TryStatic, but tries each possible URL with the app instead.
class Rack::TryDynamic
  def initialize(app, options)
    @app = app
    @try = ['', *options[:try]]
  end

  def call(env)
    orig_path = env['PATH_INFO']
    found = nil
    @try.each do |path|
      resp = @app.call(env.merge!({'PATH_INFO' => orig_path + path}))
      break if !(403..405).include?(resp[0]) && found = resp
    end
    found or @app.call(env.merge!('PATH_INFO' => orig_path))
  end
end
