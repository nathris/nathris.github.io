function love.load()
    font = love.graphics.newFont("Arial.ttf", 150)
end

function love.draw()
    love.graphics.scale(0.25,0.25)
    love.graphics.setBackgroundColor(100,100,100)
    love.graphics.setFont(font)
    love.graphics.setColor(255,255,255)
    love.graphics.print("Testing font", 100, 100)
end

function love.update()

end

