#include <vector>
#include <iostream>

#include "Brick.h"

void init()
{
    std::cout << "gl hf" << std::endl;
}

bool update()
{
    return false;
}

void draw(sf::RenderWindow *window, std::vector<sf::Sprite> sprites)
{
    window->Clear();
    for (unsigned int i=0; i<sprites.size(); ++i)
        window->Draw(sprites[i]);
    window->Display();
}

void cleanup()
{
    std::cout << "gg" << std::endl;
}

int main()
{
    //init();

    //create the game window
    sf::RenderWindow canvas(sf::VideoMode(800, 600), "Dorkanoid");

    sf::Image BackgroundImage, PaddleImage, BallImage, BricksImage;
    if (!BackgroundImage.LoadFromFile("assets/images/background.png") ||
        !PaddleImage.LoadFromFile("assets/images/paddle.png")         ||
        !BallImage.LoadFromFile("assets/images/ball.png")             ||
        !BricksImage.LoadFromFile("assets/images/bricks.png"))
    {
        return EXIT_FAILURE;
    }

    std::vector<sf::Sprite> things;
    sf::Sprite Background(BackgroundImage);
    sf::Sprite Paddle(PaddleImage);
    sf::Sprite Ball(BallImage);
    sf::Sprite Bricks(BricksImage);

    Paddle.Move(325, 550);
    Ball.Move(390, 290);
    Bricks.Move(0,100);

    things.push_back(Background);
    things.push_back(Paddle);
    things.push_back(Ball);
    things.push_back(Bricks);

    //bool IsPlaying = true;
    while (canvas.IsOpened())
    {
        // Handle events
        sf::Event Event;
        while (canvas.GetEvent(Event))
        {
            // Window closed or escape key pressed : exit
            if ((Event.Type == sf::Event::Closed) ||
               ((Event.Type == sf::Event::KeyPressed)
               && (Event.Key.Code == sf::Key::Escape)))
            {
                canvas.Close();
                break;
            }
        }

        /*if (isPlaying)
        {
            isPlaying = update();
        }*/

        draw(&canvas, things);
    }
    cleanup();
    return EXIT_SUCCESS;
}
