#include <iostream>

void init()
{
    std::cout << "gl hf" << std::endl;
}

bool update()
{
    return false;
}

void draw()
{
    std::cout << "Hello World!" << std::endl;
}

void cleanup()
{
    std::cout << "gg" << std::endl;
}

int main()
{
    init();
    bool game = true;
    while (game)
    {
        game = update();
        draw();
    }
    cleanup();
    return 0;
}
